"""Role list (ontology/roles.yaml) and screen register (design/screens.yaml) against the real pages."""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from repo_ontology import YamlError, load_yaml_file

ROLES_FILE = "ontology/roles.yaml"
SCREENS_FILE = "design/screens.yaml"
LABELS_FILE = "ontology/labels.yaml"
SCREEN_KEYS = ("id", "route", "title", "family", "audience", "status")
PAGE_FILE = re.compile(r"^page\.(tsx|ts|jsx|js|mdx)$")


@dataclass
class Registry:
    """What the checks need: role display names in order, screens by id, and the problems found."""

    role_names: list[str] = field(default_factory=list)
    role_labels: dict[str, str] = field(default_factory=dict)
    screens: dict[str, dict[str, Any]] = field(default_factory=dict)
    pages: dict[str, str] = field(default_factory=dict)
    errors: list[str] = field(default_factory=list)

    @property
    def role_columns(self) -> list[str]:
        """Display names of the roles, in the declared order: the columns of a Vai × Màn table."""
        return [self.role_labels[n] for n in self.role_names if n in self.role_labels]


def _load(root: Path, rel: str, errors: list[str]) -> dict[str, Any] | None:
    """The file as a mapping; anything else is recorded as a problem and returns None."""
    try:
        data = load_yaml_file(root / rel)
    except YamlError as exc:
        errors.append(f"{rel}: not valid YAML ({exc})")
        return None
    if data is None:
        errors.append(f"{rel}: missing or empty")
        return None
    if not isinstance(data, dict):
        errors.append(f"{rel}: must be a mapping at the top level, found {type(data).__name__}")
        return None
    return data


def route_of(page: Path, app_dir: Path) -> str | None:
    """URL path of a page file; None for files Next.js does not route (private `_folder`)."""
    parts = []
    for part in page.parent.relative_to(app_dir).parts:
        if part.startswith("_"):
            return None
        if (part.startswith("(") and part.endswith(")")) or part.startswith("@"):
            continue
        parts.append(part)
    return "/" + "/".join(parts)


def find_pages(root: Path) -> dict[str, str]:
    """Route → page file (relative to root) for every page under src/app."""
    app_dir = root / "src" / "app"
    pages: dict[str, str] = {}
    if not app_dir.is_dir():
        return pages
    for page in sorted(app_dir.rglob("*")):
        if page.is_file() and PAGE_FILE.match(page.name):
            route = route_of(page, app_dir)
            if route is not None:
                pages[route] = page.relative_to(root).as_posix()
    return pages


def load_registry(root: Path) -> Registry:
    reg = Registry()
    labels_doc = _load(root, LABELS_FILE, reg.errors) or {}
    concepts = labels_doc.get("concepts")
    if labels_doc and not isinstance(concepts, dict):
        reg.errors.append(f"{LABELS_FILE}: has no concepts mapping")
    concepts = concepts if isinstance(concepts, dict) else {}

    roles_doc = _load(root, ROLES_FILE, reg.errors)
    if roles_doc is not None:
        if roles_doc.get("holds") != "many":
            reg.errors.append(f"{ROLES_FILE}: holds must be 'many' (a person may hold several roles)")
        for item in roles_doc.get("roles") or []:
            name = str(item.get("name") or "") if isinstance(item, dict) else ""
            if not name:
                reg.errors.append(f"{ROLES_FILE}: a role has no name")
                continue
            if name in reg.role_names:
                reg.errors.append(f"{ROLES_FILE}: duplicate role '{name}'")
                continue
            reg.role_names.append(name)
            concept = concepts.get(name)
            if isinstance(concept, dict) and concept.get("kind") == "role" and concept.get("pref"):
                reg.role_labels[name] = str(concept["pref"])
            else:
                reg.errors.append(f"{ROLES_FILE}: role '{name}' has no role label in {LABELS_FILE}")
        if not reg.role_names:
            reg.errors.append(f"{ROLES_FILE}: no roles declared")

    screens_doc = _load(root, SCREENS_FILE, reg.errors)
    reg.pages = find_pages(root)
    if screens_doc is not None:
        _check_screens(screens_doc, concepts, reg)
    else:
        # Without a register every page is undeclared: say so rather than pass with zero screens.
        for route, page in reg.pages.items():
            reg.errors.append(f"page '{route}' is not in {SCREENS_FILE} ({page})")
    return reg


def _check_screens(doc: dict[str, Any], concepts: dict[str, Any], reg: Registry) -> None:
    families = doc.get("families") if isinstance(doc.get("families"), dict) else {}
    audiences = doc.get("audiences") or []
    statuses = doc.get("statuses") or []
    routes: dict[str, str] = {}
    for item in doc.get("screens") or []:
        if not isinstance(item, dict):
            reg.errors.append(f"{SCREENS_FILE}: a screen entry is not a mapping")
            continue
        sid = str(item.get("id") or "")
        missing = [k for k in SCREEN_KEYS if k not in item]
        if not sid or missing:
            reg.errors.append(f"{SCREENS_FILE}: screen '{sid}' is missing {', '.join(missing) or 'id'}")
            continue
        if sid in reg.screens:
            reg.errors.append(f"{SCREENS_FILE}: duplicate screen id '{sid}'")
            continue
        reg.screens[sid] = item
        route = str(item["route"] or "")
        if route in routes:
            reg.errors.append(f"{SCREENS_FILE}: duplicate route '{route}'")
        routes[route] = sid
        family, audience, status, title = item["family"], item["audience"], item["status"], item["title"]
        if family is not None and family not in families:
            reg.errors.append(f"{SCREENS_FILE}: screen '{sid}': unknown family '{family}'")
        if audience not in audiences:
            reg.errors.append(f"{SCREENS_FILE}: screen '{sid}': unknown audience '{audience}'")
        if status not in statuses:
            reg.errors.append(f"{SCREENS_FILE}: screen '{sid}': unknown status '{status}'")
        if title is None:
            if audience != "dev":
                reg.errors.append(f"{SCREENS_FILE}: screen '{sid}': title is required")
        elif title not in concepts:
            reg.errors.append(
                f"{SCREENS_FILE}: screen '{sid}': title label '{title}' is not in {LABELS_FILE}"
            )
        has_page = route in reg.pages
        if status == "built" and not has_page:
            reg.errors.append(f"{SCREENS_FILE}: screen '{sid}' is built but has no page")
        if status == "planned" and has_page:
            reg.errors.append(
                f"{SCREENS_FILE}: screen '{sid}' is planned but has a page ({reg.pages[route]})"
            )
    for route, page in reg.pages.items():
        if route not in routes:
            reg.errors.append(f"page '{route}' is not in {SCREENS_FILE} ({page})")

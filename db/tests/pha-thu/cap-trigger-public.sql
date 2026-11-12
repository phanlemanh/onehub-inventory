-- Break test, row 7a (Ngoài-20), scratch database only: every role, the API role included through PUBLIC, may add
-- triggers to companies. The suite must fail with `HỎNG vai-api-khong-quyen-nguy-hiem: public.companies TRIGGER`.
grant trigger on companies to public;

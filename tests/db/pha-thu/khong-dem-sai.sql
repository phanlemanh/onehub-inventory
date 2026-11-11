-- Break: a wrong code no longer counts as an attempt, so the third wrong code does not kill the code.
do $$
declare
  d text;
  broken text;
begin
  select pg_get_functiondef('app.login_verify_code(text, text, text, integer, integer)'::regprocedure) into d;
  broken := replace(d, 'failed_attempts = c.failed_attempts + 1', 'failed_attempts = c.failed_attempts');
  if broken = d then
    raise exception 'bản phá không đổi được hàm login_verify_code';
  end if;
  execute broken;
end $$;

-- Auto-assign default 'user' role on signup (bypasses RLS via SECURITY DEFINER)
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();

-- Enforce: exactly 1 active developer, max 3 active admins — concurrency-safe
create or replace function enforce_role_limits()
returns trigger language plpgsql as $$
declare cnt int;
begin
  if new.revoked_at is null then
    if new.role = 'developer' then
      perform pg_advisory_xact_lock(hashtext('role_cap_developer'));
      select count(*) into cnt from user_roles
        where role = 'developer' and revoked_at is null and id <> new.id;
      if cnt >= 1 then raise exception 'Only one active Developer account is permitted'; end if;
    elsif new.role = 'admin' then
      perform pg_advisory_xact_lock(hashtext('role_cap_admin'));
      select count(*) into cnt from user_roles
        where role = 'admin' and revoked_at is null and id <> new.id;
      if cnt >= 3 then raise exception 'Maximum of 3 active Admin accounts reached'; end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_role_limits on user_roles;
create trigger trg_enforce_role_limits
before insert or update on user_roles
for each row execute procedure enforce_role_limits();

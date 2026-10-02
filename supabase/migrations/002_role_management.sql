-- View for user_roles with email for the dashboard
create or replace view user_roles_view with (security_invoker = true) as
select ur.*, u.email as user_email 
from user_roles ur 
join auth.users u on u.id = ur.user_id;

grant select on user_roles_view to authenticated;
grant select on user_roles_view to anon;

-- RPC to get user id by email securely
create or replace function get_user_id_by_email(lookup_email text)
returns uuid language plpgsql security definer as $$
declare
  found_id uuid;
begin
  select id into found_id from auth.users where email = lookup_email;
  return found_id;
end;
$$;

from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group
from configuration.models import SiteConfiguration
try:
  site_config = SiteConfiguration.objects.first()
except:
  site_config = None

def is_in_group(user, group_name):
  """
  Takes a user and a group name, and returns `True` if the user is in that group.
  """
  try:
      return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
  except Group.DoesNotExist:
      return None

class HasGroupPermission(BasePermission):
  """
  Ensure user is in required groups.
  """
  def has_permission(self, request, view):
    # Get a mapping of methods -> required group.
    required_groups_mapping = getattr(view, "required_groups", {})

    # Determine the required groups for this particular request method.
    required_groups = required_groups_mapping.get(request.method, [])

    # Return True if the user has all the required groups or is staff.
    # print(all([is_in_group(request.user, group_name) if group_name != "__all__" else True for group_name in required_groups]) or (request.user and request.user.is_staff))
    return all([is_in_group(request.user, group_name) if group_name != "__all__" else True for group_name in required_groups]) or (request.user and request.user.is_staff)

class SiteEnabled(BasePermission):
  def has_permission(self, request, view):
    if site_config.maintenance_mode == False and site_config.beta_mode == False:
      return True
    else:
      return False

class IsSuperUser(BasePermission):
  def has_permission(self, request, view):
    return request.user and request.user.is_superuser

# Allow access if superuser or is owner
class IsOwner(BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        return obj.user == request.user
    else:
      return False

class IsOrderOwner(BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.user:
      if request.user.is_superuser or request.user.is_staff:
        return True
      else:
        return obj.user == request.user
    else:
      return False

class IsOrderRider(BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.user:
      if request.user.is_superuser or request.user.is_staff:
        return True
      else:
        return obj.rider == request.user
    else:
      return False

# Allow access if superuser or is owner of the order item
# And order_items.order must be unordered or request is only GET
class IsOrderItemOwner(BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.user:
      if request.user.is_superuser and obj.order.is_ordered == False:
        return True
      else:
        print(obj.order.user == request.user and obj.order.is_ordered == False)
        return obj.order.user == request.user and obj.order.is_ordered == False
    else:
      return False

class IsOrderItemRider(BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.user:
      if request.user.is_superuser and obj.order.is_ordered == False:
        return True
      else:
        return obj.order.rider == request.user and obj.order.is_ordered == False or request.method == 'GET'
    else:
      return False

class ReadOnly(BasePermission):
  def has_permission(self, request, view):
    return request.method in SAFE_METHODS

class PostOnly(BasePermission):
  def has_permission(self, request, view):
    return request.method == 'GET'
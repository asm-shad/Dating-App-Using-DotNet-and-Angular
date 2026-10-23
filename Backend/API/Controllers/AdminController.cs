using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager, IUnitOfWork uow) : BaseApiController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users.Order().ToListAsync();
        var usersList = new List<object>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            usersList.Add(
                new
                {
                    user.Id,
                    user.Email,
                    Roles = roles.ToList()
                }
            );
        }
        return Ok(usersList);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{userId}")]
    public async Task<ActionResult<IList<string>>> EditRoles(string userId, [FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

        var selectedRoles = roles.Split(",").ToArray();

        var user = await userManager.FindByIdAsync(userId);

        if (user == null) return BadRequest("Couldn't retrive user");

        var userRoles = await userManager.GetRolesAsync(user);

        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

        if (!result.Succeeded) return BadRequest("Failed to add to roles");

        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

        if (!result.Succeeded) return BadRequest("Failed to remove roles");

        return Ok(await userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public async Task<ActionResult<IList<Photo>>> GetPhotosForModeration()
    {
        var photos = await uow.PhotoRepository.GetUnapprovedPhotos();
        if (photos.Count > 0)
            return Ok(photos);

        return NoContent();
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("approve-photo/{photoId}")]
    public async Task<ActionResult> ApprovePhoto(int photoId)
    {
        var photo = await uow.PhotoRepository.GetPhotoById(photoId);

        if (photo == null) BadRequest("Photo not found");

        photo!.IsApproved = true;

        var member = await uow.MemberRepository.GetMemberForUpdate(photo.MemberId);

        if (member != null && (member.ImageUrl == null || member.User.ImageUrl == null))
        {
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
        }

        if (await uow.Complete()) return Ok();

        return BadRequest("Couldn't approve Photo");

    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("reject-photo/{photoId}")]
    public async Task<ActionResult> RejectPhoto(int photoId)
    {
        var photo = await uow.PhotoRepository.GetPhotoById(photoId);

        if (photo != null)
        {
            uow.PhotoRepository.RemovePhoto(photo!);

            if (await uow.Complete()) return Ok();

            return BadRequest("Couldn't remove Photo");
        }

        return BadRequest("Photo not found");
    }
}

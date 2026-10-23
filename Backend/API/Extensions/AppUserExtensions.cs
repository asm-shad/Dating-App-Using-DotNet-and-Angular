using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;

public static class AppUserExtensions
{
    public static async Task<UserDto> ToDto(this AppUser user, ITokenService tokenService)
    {
        return  new UserDto
        {
            DisplayName = user.DisplayName,
            Email = user.Email,
            Id = user.Id,
            ImgUrl = user.ImageUrl,
            Token = await tokenService.CreateToken(user)
        };
    }
}

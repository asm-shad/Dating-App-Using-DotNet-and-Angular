using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(IUnitOfWork uow) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();

        if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");

        var existingLike = await uow.LikeRepository.GetMemberLike(sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };

            uow.LikeRepository.AddLike(like);
        }
        else
        {
            uow.LikeRepository.DeleteLike(existingLike);
        }

        if (await uow.Complete()) return Ok();

        return BadRequest("Failed to update like state");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await uow.LikeRepository.GetCurrentmembersLikeIds(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes([FromQuery] LikeParams likeParams)
    {
        likeParams.MemberId = User.GetMemberId();
        var members = await uow.LikeRepository.GetMemberLikes(likeParams);

        return Ok(members);
    }
}

using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikeRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentmembersLikeIds(string memberId)
    {
        return await context.Likes.Where(x => x.SourceMemberId == memberId).Select(x => x.TargetMemberId).ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResults<Member>> GetMemberLikes(LikeParams likeParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likeParams.Predicate)
        {
            case "liked":
                result = query.Where(x => x.SourceMemberId == likeParams.MemberId).Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query.Where(x => x.TargetMemberId == likeParams.MemberId).Select(x => x.SourceMember);
                break;
            default:
                var likeIds = await GetCurrentmembersLikeIds(likeParams.MemberId);
                result = query.Where(x => x.TargetMemberId == likeParams.MemberId && likeIds.Contains(x.SourceMemberId)).Select(x => x.SourceMember);
                break;
        }
        return await PaginationHelper.CreateAsync(result, likeParams.pageNumber, likeParams.PageSize);
    }

}

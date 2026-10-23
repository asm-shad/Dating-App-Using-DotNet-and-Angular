using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikeRepository
{
    Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);

    Task<PaginatedResults<Member>> GetMemberLikes(LikeParams likeParams);

    Task<IReadOnlyList<string>> GetCurrentmembersLikeIds(string memberId);
    
    void DeleteLike(MemberLike like);
    void AddLike(MemberLike like);

}

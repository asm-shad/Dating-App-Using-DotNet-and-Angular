namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRepository MemberRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikeRepository LikeRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}

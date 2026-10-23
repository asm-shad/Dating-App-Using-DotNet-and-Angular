namespace API.Helpers;

public class LikeParams : PagingParams
{
    public required string Predicate { get; set; }
    public string MemberId { get; set; } = "";
}

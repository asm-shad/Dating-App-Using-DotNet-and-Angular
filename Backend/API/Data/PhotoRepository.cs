using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class PhotoRepository(AppDbContext context) : IPhotoRepository
{
    public async Task<Photo?> GetPhotoById(int id)
    {
        return await context.Photo.Where(x => x.Id == id).IgnoreQueryFilters().FirstOrDefaultAsync();
    }

    public async Task<IList<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.Photo.Where(x => !x.IsApproved).IgnoreQueryFilters().Select(u => new PhotoForApprovalDto
            {
                Id = u.Id,
                MemberId = u.MemberId,
                Url = u.Url,
                IsApproved = u.IsApproved
            }).ToListAsync();
    }

    public void RemovePhoto(Photo photo)
    {
        context.Photo.Remove(photo);
    }

}

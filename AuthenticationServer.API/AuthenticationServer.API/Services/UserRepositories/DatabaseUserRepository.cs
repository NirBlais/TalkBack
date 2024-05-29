using AuthenticationServer.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationServer.API.Services.UserRepositories
{
    public class DatabaseUserRepository : IUserRepository
    {
        private readonly AuthenticationDbContext _context;

        public DatabaseUserRepository(AuthenticationDbContext context)
        {
            _context = context;
        }

        public async Task<User> Create(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetByID(Guid userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User> GetByUserName(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == userName);
        }
        public async Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }
    }
}

using AuthenticationServer.API.Models;

namespace AuthenticationServer.API.Services.UserRepositories
{
    public class InMemoryUserRepository
    {
        private readonly List<User> _users = new List<User>();
        public Task<User> Create(User user)
        {
            user.Id = Guid.NewGuid();
            _users.Add(user);
            return Task.FromResult(user);
        }

        public Task<User> GetByID(Guid userId)
        {
            return Task.FromResult(_users.FirstOrDefault(u => u.Id == userId));
        }

        public Task<User> GetByUserName(string userName)
        {
            return Task.FromResult(_users.FirstOrDefault(u => u.Username == userName));
        }
    }
}

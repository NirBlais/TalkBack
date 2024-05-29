using AuthenticationServer.API.Models;

namespace AuthenticationServer.API.Services.UserRepositories
{
    public interface IUserRepository
    {

        Task<User> GetByUserName(string userName);

        Task<User> Create(User user);
        Task<User> GetByID(Guid userId);

        Task<List<User>> GetAll();

    }
}

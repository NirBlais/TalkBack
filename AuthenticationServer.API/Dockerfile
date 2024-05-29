# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build-env
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build the app
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine
WORKDIR /app
COPY --from=build-env /app/out .

# Expose port and run the app
EXPOSE 5174
ENTRYPOINT ["dotnet", "AuthenticationServer.API.dll"]
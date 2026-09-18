# Build stage: compiles the app using the full .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy just the project file first, so Docker can cache the restore
# step separately from the rest of the source code — if only your
# code changes (not dependencies), Docker skips re-running restore.
COPY TodoApi.csproj .
RUN dotnet restore

# Now copy the rest of the source and build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage: a much smaller image containing only what's needed
# to RUN the app, not build it — the SDK image above is much larger
# than necessary for actually running a compiled app.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render provides the PORT it expects your app to listen on via this
# environment variable; ASP.NET Core needs to be told to bind to it.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TodoApi.dll"]
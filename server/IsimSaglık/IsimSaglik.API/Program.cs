using IsimSaglik.API.Extensions;
using IsimSaglik.API.Hubs;
using IsimSaglik.API.Middleware;
using IsimSaglik.Service.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


// Settings
builder.Services.ConfigureSettings(builder.Configuration);


// Supabase
builder.Services.ConfigureSupabase();


// Managers
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();


// Registers
builder.Services.RegisterInfrastructures();
builder.Services.RegisterRepositories();
builder.Services.RegisterServices();


// AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps(typeof(MappingProfile).Assembly);
});


// JWT
builder.Services.ConfigureJWT(builder.Configuration);


// Cors
builder.Services.ConfigureCors();


// SignalR
builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 41943040; // 5 MB
});


// Swagger
builder.Services.ConfigureSwagger();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();


var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// SignalR Hubs
app.MapHub<SensorLogHub>("hub/sensor-log");

app.Run();
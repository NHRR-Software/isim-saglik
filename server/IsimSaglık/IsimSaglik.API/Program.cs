using IsimSaglik.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Settings
builder.Services.ConfigureSettings(builder.Configuration);

// Managers
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();

// Registers
builder.Services.RegisterInfrastructures();
builder.Services.RegisterRepositories();
builder.Services.RegisterServices();

// AutoMapper


// JWT
builder.Services.ConfigureJWT(builder.Configuration);


// Cors
builder.Services.ConfigureCors();


// SignalR


// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.ConfigureSwagger();
builder.Services.AddHttpContextAccessor();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
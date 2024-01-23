import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import morgan from "morgan";
import { AppModule } from "./app.module";
import { CORS } from "./commons/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  app.setGlobalPrefix("api");
  app.use(morgan("dev"));
  app.enableCors(CORS);

  const config = new DocumentBuilder()
    .setTitle("VIRTUALPC API")
    .setDescription("API documentation for VIRTUALPC API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("documentation", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [AuthModule, TenantsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

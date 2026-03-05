import { Router } from 'express';
import {
  GetCurrentUser,
  GetUserById,
  GetUsers,
  LoginUser,
  LogoutUser,
  RefreshToken,
  RegisterUser,
  UpdateUserById,
} from './user.controllers.ts';
import { authorizeRoles, isAuthenticated } from './user.middlewares.ts';

const userRouter = Router();

userRouter.post('/auth/register', RegisterUser);
userRouter.post('/auth/login', LoginUser);
userRouter.post('/auth/refresh', RefreshToken);
userRouter.post('/auth/logout', LogoutUser);
userRouter.get('/auth/me', isAuthenticated, GetCurrentUser);
userRouter.get('/users', isAuthenticated, authorizeRoles('MANAGER'), GetUsers);
userRouter.put(
  '/users/:id',
  isAuthenticated,
  authorizeRoles('MANAGER'),
  UpdateUserById,
);
userRouter.get(
  '/users/:id',
  isAuthenticated,
  authorizeRoles('MANAGER'),
  GetUserById,
);

export default userRouter;

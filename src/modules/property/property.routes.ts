import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../user/user.middlewares.ts";
import {
  createPropertyController,
  getPropertiesController,
  getPropertyByIdController,
  assignManagerController,
} from "./property.controllers.ts";

const propertyRouter = Router();

// POST /api/v1/properties
propertyRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("MANAGER"),
  createPropertyController
);

// GET /api/v1/properties
propertyRouter.get(
  "/",
  isAuthenticated,
  authorizeRoles("MANAGER"),
  getPropertiesController
);

// GET /api/v1/properties/:id
propertyRouter.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("MANAGER"),
  getPropertyByIdController
);

// POST /api/v1/properties/:id/assign-manager
propertyRouter.post(
  "/:id/assign-manager",
  isAuthenticated,
  authorizeRoles("ADMIN"),
  assignManagerController
);

export default propertyRouter;
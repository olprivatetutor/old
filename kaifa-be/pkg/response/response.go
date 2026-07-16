package response

import "github.com/gofiber/fiber/v2"

type Body struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
}

func OK(c *fiber.Ctx, data any) error {
	return c.Status(fiber.StatusOK).JSON(Body{Success: true, Data: data})
}

func Created(c *fiber.Ctx, data any) error {
	return c.Status(fiber.StatusCreated).JSON(Body{Success: true, Data: data})
}

func BadRequest(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusBadRequest).JSON(Body{Success: false, Message: msg})
}

func Unauthorized(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusUnauthorized).JSON(Body{Success: false, Message: msg})
}

func Forbidden(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusForbidden).JSON(Body{Success: false, Message: msg})
}

func InternalError(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusInternalServerError).JSON(Body{Success: false, Message: msg})
}

func NotFound(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusNotFound).JSON(Body{Success: false, Message: msg})
}

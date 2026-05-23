const { z } = require("zod");

const bookingSchema = z
  .object({
    roomId: z.coerce.number({
      required_error: "Room ID is required",
      invalid_type_error: "Room ID must be a number",
    }),
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string({
      required_error: "End date is required",
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !isNaN(start) && !isNaN(end) && end > start;
    },
    {
      message: "End date must be after start date and dates must be valid",
      path: ["endDate"],
    }
  );

module.exports = { bookingSchema };

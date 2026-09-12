import { Button, type ButtonProps } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import type { VehicleType } from "@/lib/booking";

interface BookingButtonProps extends ButtonProps {
  vehicle?: VehicleType;
  packageId?: string;
}

export function BookingButton({ vehicle, packageId, onClick, children, ...props }: BookingButtonProps) {
  const { openBooking } = useBooking();

  return (
    <Button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openBooking({ vehicle, packageId });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
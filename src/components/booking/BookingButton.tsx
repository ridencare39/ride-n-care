import { Button, type ButtonProps } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import type { VehicleType } from "@/lib/booking";
import type { BikeServiceId } from "@/lib/pricing";

interface BookingButtonProps extends ButtonProps {
  vehicle?: VehicleType;
  packageId?: string;
  serviceId?: BikeServiceId;
}

export function BookingButton({ vehicle, packageId, serviceId, onClick, children, ...props }: BookingButtonProps) {
  const { openBooking } = useBooking();

  return (
    <Button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openBooking({ vehicle, packageId, serviceId });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
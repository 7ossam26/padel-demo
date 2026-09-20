import { Route, Routes } from "react-router-dom";
import { OwnerBlockScreen } from "../screens/owner/OwnerBlockScreen";
import { OwnerBookingDetailScreen } from "../screens/owner/OwnerBookingDetailScreen";
import { OwnerBookingsScreen } from "../screens/owner/OwnerBookingsScreen";
import { OwnerDashboardScreen } from "../screens/owner/OwnerDashboardScreen";
import { OwnerSetupClubScreen } from "../screens/owner/OwnerSetupClubScreen";
import { OwnerSetupScheduleScreen } from "../screens/owner/OwnerSetupScheduleScreen";
import { BrowseScreen } from "../screens/player/BrowseScreen";
import { CheckoutScreen } from "../screens/player/CheckoutScreen";
import { ConfirmationScreen } from "../screens/player/ConfirmationScreen";
import { CourtDetailScreen } from "../screens/player/CourtDetailScreen";
import { FiltersScreen } from "../screens/player/FiltersScreen";
import { MyBookingsScreen } from "../screens/player/MyBookingsScreen";
import { StartScreen } from "../screens/player/StartScreen";
import { TimeSelectScreen } from "../screens/player/TimeSelectScreen";
import { NotFoundScreen } from "../screens/shared/NotFoundScreen";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/player/courts" element={<BrowseScreen />} />
      <Route path="/player/filters" element={<FiltersScreen />} />
      <Route path="/player/courts/:clubId" element={<CourtDetailScreen />} />
      <Route path="/player/courts/:clubId/time" element={<TimeSelectScreen />} />
      <Route path="/player/checkout" element={<CheckoutScreen />} />
      <Route path="/player/confirmation/:bookingId" element={<ConfirmationScreen />} />
      <Route path="/player/bookings" element={<MyBookingsScreen />} />
      <Route path="/owner/setup/club" element={<OwnerSetupClubScreen />} />
      <Route path="/owner/setup/schedule" element={<OwnerSetupScheduleScreen />} />
      <Route path="/owner/dashboard" element={<OwnerDashboardScreen />} />
      <Route path="/owner/bookings" element={<OwnerBookingsScreen />} />
      <Route path="/owner/bookings/:bookingId" element={<OwnerBookingDetailScreen />} />
      <Route path="/owner/availability/block" element={<OwnerBlockScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

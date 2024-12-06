import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  appointmentData: any;
  onPaymentComplete: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentModal({ open, onClose, appointmentData, onPaymentComplete }: PaymentModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleCashPayment = async () => {
    try {
      setLoading(true);
      await axios.post('/api/appointments/book', {
        ...appointmentData,
        paymentMethod: 'cash'
      });
      onPaymentComplete();
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await axios.post('/api/payments/create-session', {
        appointmentData,
        successUrl: `${window.location.origin}/appointments/success`,
        cancelUrl: `${window.location.origin}/appointments/cancel`
      });

      const { sessionId } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Choose Payment Method</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Consultation Fee: ${appointmentData?.consultationFee || 0}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please select your preferred payment method:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleOnlinePayment}
                  sx={{ minWidth: 120 }}
                >
                  Pay Online
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCashPayment}
                  sx={{ minWidth: 120 }}
                >
                  Pay Cash
                </Button>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
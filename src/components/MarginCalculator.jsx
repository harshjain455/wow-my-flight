import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CalculateIcon from '@mui/icons-material/Calculate';
import PublishIcon from '@mui/icons-material/Publish';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAlert } from '../contexts/AlertContext';

export default function MarginCalculator({ activeRequest, onPublishQuote }) {
  const { showAlert } = useAlert();

  const [netFare, setNetFare] = useState(activeRequest?.netFare || 4500);
  const [markupPct, setMarkupPct] = useState(15);
  const [fixedMarkup, setFixedMarkup] = useState(0);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Synchronize when active request changes
  useEffect(() => {
    if (activeRequest?.netFare) {
      setNetFare(activeRequest.netFare);
      setPublishSuccess(false);
    }
  }, [activeRequest]);

  const numNet = Number(netFare) || 0;
  const numMarkup = Number(markupPct) || 0;
  const numFixed = Number(fixedMarkup) || 0;

  const sellingPrice = numFixed > 0
    ? numNet + numFixed
    : numNet * (1 + numMarkup / 100);

  const profit = sellingPrice - numNet;
  const profitPct = numNet > 0 ? ((profit / numNet) * 100).toFixed(1) : '0.0';

  const handleReset = () => {
    setNetFare(activeRequest?.netFare || 4500);
    setMarkupPct(15);
    setFixedMarkup(0);
    setPublishSuccess(false);
    showAlert('Calculator reset to default values', 'info');
  };

  const handleCalculate = () => {
    showAlert(
      `Calculated: Selling Price = $${sellingPrice.toFixed(2)}, Net Profit = $${profit.toFixed(2)} (${profitPct}%)`,
      'info'
    );
  };

  const handlePublish = () => {
    if (numNet <= 0) {
      showAlert('Please enter a valid Net Fare before publishing', 'warning');
      return;
    }

    setPublishSuccess(true);
    showAlert('Quote generated successfully. Status updated to Ready for Agent.', 'success');

    if (onPublishQuote) {
      onPublishQuote({
        requestId: activeRequest?.id || 'FE-4591',
        netFare: numNet,
        sellingPrice: sellingPrice,
        profit: profit,
        profitPct: profitPct,
        status: 'Ready for Agent'
      });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <CalculateIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
          NET vs. SELLING PRICE CALCULATOR
        </Typography>
        <Chip
          size="small"
          label="Internal GDS Margin Desk"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, fontSize: '0.68rem', ml: 'auto' }}
        />
      </Box>

      {/* Success Alert Banner */}
      {publishSuccess && (
        <Alert severity="success" icon={<CheckCircleIcon />} onClose={() => setPublishSuccess(false)} sx={{ mb: 2, borderRadius: 2 }}>
          Quote generated successfully. Status updated to: <b>Ready for Agent</b>.
        </Alert>
      )}

      {/* Grid Layout: Left Parsed Summary, Right Inputs & Output */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
        {/* Left: Parsed Flights Overview */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 1 }}>
            Parsed Flights Overview
          </Typography>

          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Active Request #{activeRequest?.id || 'FE-4591'}
              </Typography>
              <Chip size="small" label="✓ Validated" color="success" sx={{ fontSize: '0.64rem', height: 20 }} />
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>
              {activeRequest?.origin || 'JFK'} → {activeRequest?.destination || 'LHR'}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Dates: <b>{activeRequest?.travelDate || '15OCT - 22OCT'}</b> &nbsp;|&nbsp;
              Class: <b>{activeRequest?.cabinClass || 'Business'}</b> &nbsp;|&nbsp;
              Pax: <b>{activeRequest?.passengers || 2} Pax</b>
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1.5, border: '1px solid #E2E8F0', fontSize: '0.78rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>Flight 1: AA 100 (Business)</Typography>
                  <Typography variant="caption" color="text.secondary">15OCT</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {activeRequest?.origin || 'JFK'} 18:30 → {activeRequest?.destination || 'LHR'} 07:30+1
                </Typography>
              </Box>

              <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1.5, border: '1px solid #E2E8F0', fontSize: '0.78rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>Flight 2: BA 117 (Business)</Typography>
                  <Typography variant="caption" color="text.secondary">22OCT</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {activeRequest?.destination || 'LHR'} 11:00 → {activeRequest?.origin || 'JFK'} 14:30
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right: Pricing Calculator Inputs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Net Fare Cost Input */}
          <TextField
            label="Net Fare / Cost (USD) *"
            type="number"
            size="small"
            value={netFare}
            onChange={(e) => setNetFare(e.target.value)}
            fullWidth
            helperText="Total wholesale cost provided by supplier/GDS"
          />

          {/* Manual Markup Slider & Percentage */}
          <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#FAFAFA' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                MANUAL MARKUP PERCENTAGE
              </Typography>
              <Chip
                size="small"
                label={`${markupPct}% Markup`}
                color={numFixed > 0 ? 'default' : 'primary'}
                sx={{ fontWeight: 900 }}
              />
            </Box>

            <Slider
              value={numMarkup}
              min={0}
              max={50}
              step={1}
              onChange={(_, val) => {
                setMarkupPct(val);
                setFixedMarkup(0);
              }}
              disabled={numFixed > 0}
              color="primary"
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Fixed Markup USD Input */}
          <TextField
            label="Fixed Markup USD (Overrides %)"
            type="number"
            size="small"
            value={fixedMarkup}
            onChange={(e) => setFixedMarkup(e.target.value)}
            fullWidth
            placeholder="e.g. 500"
            helperText="Set a lump-sum dollar markup instead of %"
          />

          {/* Reset & Calculate Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{ fontWeight: 700, flex: 1 }}
            >
              Reset
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<CalculateIcon />}
              onClick={handleCalculate}
              sx={{ fontWeight: 700, flex: 1 }}
            >
              Calculate
            </Button>
          </Box>

          {/* Real-time Calculation Result Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: profit >= 0 ? '#ECFDF5' : '#FEF2F2',
              border: '1px solid',
              borderColor: profit >= 0 ? '#6EE7B7' : '#FCA5A5',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                Selling Price to Client:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                USD ${sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>

            <Divider sx={{ my: 0.8 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                Net Profit Margin:
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 900,
                  color: profit >= 0 ? 'success.main' : 'error.main'
                }}
              >
                USD ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({profitPct}%)
                {profit >= 0 ? ' 🟢' : ' 🔴'}
              </Typography>
            </Box>
          </Paper>

          {/* Generate & Publish Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            startIcon={<PublishIcon />}
            onClick={handlePublish}
            sx={{ fontWeight: 800, py: 1.2, borderRadius: 2 }}
          >
            Generate & Publish Quote to Client Profile
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

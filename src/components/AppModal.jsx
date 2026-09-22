import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AppModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="app-modal-title"
      aria-describedby="app-modal-description"
      PaperProps={{
        sx: {
          // Responsive side margins & max height
          mx: { xs: 1.5, sm: 3 },
          my: { xs: 2, sm: 4 },
          maxHeight: { xs: 'calc(100dvh - 32px)', sm: '90dvh' },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // children handle their own scroll
        }
      }}
    >
      {/* ── Sticky Header ── */}
      {title && (
        <DialogTitle
          id="app-modal-title"
          sx={{
            m: 0,
            px: { xs: 2, sm: 2.5 },
            py: 2,
            fontWeight: 600,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            // Sticky so it stays visible when content scrolls
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'background.paper',
            flexShrink: 0,
          }}
        >
          {title}
          {!loading && onClose && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              sx={{
                color: (theme) => theme.palette.grey[500],
                ml: 1,
                // 44px tap target on mobile
                minWidth: 36,
                minHeight: 36,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* ── Scrollable Body ── */}
      <DialogContent
        className="modal-scroll"
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 2.5,
          pb: 1,
          mt: title ? 0 : 2,
          maxHeight: { xs: '55vh', sm: '60vh', md: '65vh' },
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          flexGrow: 1,
          // Smooth scroll on iOS
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </DialogContent>

      {/* ── Sticky Footer Actions ── */}
      {actions && (
        <DialogActions
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            // Sticky at bottom
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            bgcolor: 'background.paper',
            flexShrink: 0,
            // Full-width buttons on mobile
            '& > button': {
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
              minHeight: 40,
            },
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AppModal;

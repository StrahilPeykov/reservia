import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Modal, Card } from 'react-bootstrap';

const ReservationQRCode = ({ reservation, show, onHide }) => {
  // Create a data string containing reservation details
  const qrData = JSON.stringify({
    id: reservation?.id,
    spaceName: reservation?.spaceName,
    date: reservation?.date,
    startTime: reservation?.startTime,
    endTime: reservation?.endTime,
    username: reservation?.username
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reservation QR Code</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Card className="p-4 mb-3">
          <Card.Title>{reservation?.spaceName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {reservation?.date} | {reservation?.startTime} - {reservation?.endTime}
          </Card.Subtitle>
          <div className="my-4 d-flex justify-content-center">
            <QRCodeSVG
              value={qrData}
              size={220}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/logo.png",
                excavate: true,
                height: 24,
                width: 24
              }}
            />
          </div>
          <p className="small text-muted">
            Show this QR code for check-in at the library desk
          </p>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={() => window.print()}>Print</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationQRCode;
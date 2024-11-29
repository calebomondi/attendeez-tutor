import { useEffect, useRef, useState } from "react";
import { 
    NotFoundException, 
    ChecksumException, 
    FormatException 
} from "@zxing/library";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface QRScannerProps {
    onScan?: (result: string) => void;
    onError?: (error: Error) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
    onScan = () => {},
    onError = () => {},
}) => {
    const [scanning, setScanning] = useState<boolean>(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectDevice] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

    useEffect(() => {
        const initScanner = async () => {
            try {
                codeReaderRef.current = new BrowserMultiFormatReader();
                const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
                setDevices(videoInputDevices);

                if (videoInputDevices.length > 0) {
                    setSelectDevice(videoInputDevices[0].deviceId);
                }
            } catch (error) {
                onError(error instanceof Error ? error : new Error("Failed to initialize scanner!"));
            }
        };

        initScanner();

        return () => {
            if (codeReaderRef.current) {
                codeReaderRef.current.decodeFromVideoDevice(undefined, undefined, () => {});
            }
        };
    }, [onError]);

    const startScanning = async () => {
        if (scanning || !codeReaderRef.current || !videoRef.current || !selectedDevice) return;

        try {
            await codeReaderRef.current.decodeFromVideoDevice(
                selectedDevice,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        onScan(result.getText());
                        stopScanning();
                    }
                    if (error) {
                        if (
                            error instanceof NotFoundException ||
                            error instanceof ChecksumException ||
                            error instanceof FormatException
                        ) {
                            return; // Non-critical errors
                        }
                        onError(error instanceof Error ? error : new Error("Scanning Error!"));
                    }
                }
            );
            setScanning(true);
        } catch (error) {
            onError(error instanceof Error ? error : new Error("Failed to start scanning!"));
            setScanning(false);
        }
    };

    const stopScanning = () => {
        if (codeReaderRef.current) {
            codeReaderRef.current.decodeFromVideoDevice(undefined, undefined, () => {});
        }
        setScanning(false);
    };

    const handleDeviceChange = (deviceId: string) => {
        stopScanning();
        setSelectDevice(deviceId);

        setTimeout(() => {
            startScanning();
        }, 500);
    };

    return (
        <div className="qr-scanner p-4 flex flex-col justify-center align-middle">
            <video
                ref={videoRef}
                className="bg-gray-400 w-full h-auto rounded-lg"
            />

            <div className="flex justify-center mt-3 p-1">
                <select
                    value={selectedDevice || ""}
                    onChange={(e) => handleDeviceChange(e.target.value)}
                    className="w-1/3 p-2 rounded-lg"
                >
                    {devices.map((device) => (
                        <option 
                            key={device.deviceId} 
                            value={device.deviceId}
                            className="p-2 font-mono"
                        >
                            {device.label || `Camera ${devices.indexOf(device) + 1}`}
                        </option>
                    ))}
                    {!selectedDevice && <option value="" disabled>Select a Camera</option>}
                </select>
            </div>

            <div className="scanner-controls flex justify-center mt-3 p-1">
                {!scanning ? (
                    <button onClick={startScanning} className="btn btn-success w-1/3 text-white">Start Scanning</button>
                ) : (
                    <button onClick={stopScanning} className="btn btn-success w-1/3 text-white">Stop Scanning</button>
                )}
            </div>
        </div>
    );
};

export default QRScanner;

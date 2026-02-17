import React, { useState } from 'react';
import Button from './Button';
import '../styles/Button.css';

const ShareButton = ({ url = window.location.href, title = 'Share' }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: url,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy!', err);
            }
        }
    };

    return (
        <Button
            variant="outline"
            size="small"
            onClick={handleShare}
            startIcon={copied ? '✅' : '🔗'}
            title="Share page"
        >
            {copied ? 'Copied!' : title}
        </Button>
    );
};

export default ShareButton;

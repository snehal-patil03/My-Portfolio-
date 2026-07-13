import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="section-container">
        <div className="border-t border-hairline py-8 flex flex-col items-center justify-center">
          <p className="label-caps text-muted">
            BUILT WITH CARE · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

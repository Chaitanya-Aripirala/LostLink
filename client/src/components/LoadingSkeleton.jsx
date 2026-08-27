import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="card skeleton-card-wrapper" style={{ padding: '0px' }}>
      <div className="skeleton skeleton-card-image" style={{ width: '100%' }}></div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '12px', width: '30%', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '80%', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '12px' }}></div>
          <div className="skeleton" style={{ height: '32px', width: '90px', borderRadius: '8px' }}></div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: '32px', width: '250px' }}></div>
        <div className="skeleton" style={{ height: '40px', width: '120px', borderRadius: '8px' }}></div>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="skeleton" style={{ height: '32px', width: '32px', borderRadius: '50%' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '60%' }}></div>
            <div className="skeleton" style={{ height: '32px', width: '40%' }}></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
        <div className="card" style={{ flex: '2', minWidth: '300px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton" style={{ height: '24px', width: '150px' }}></div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="skeleton" style={{ height: '40px', width: '40px', borderRadius: '8px' }}></div>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
                <div className="skeleton" style={{ height: '12px', width: '70%' }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ flex: '1', minWidth: '250px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton" style={{ height: '24px', width: '120px' }}></div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ height: '14px', width: '90%' }}></div>
              <div className="skeleton" style={{ height: '10px', width: '40%' }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', width: '100%', marginTop: '32px' }}>
      <div style={{ flex: '1.2', minWidth: '300px' }}>
        <div className="skeleton" style={{ height: '400px', width: '100%', borderRadius: '16px' }}></div>
      </div>
      <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '36px', width: '70%' }}></div>
        <div className="skeleton" style={{ height: '24px', width: '30%', borderRadius: '12px' }}></div>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%' }}></div>
        <div className="skeleton" style={{ height: '16px', width: '85%' }}></div>
        <div className="skeleton" style={{ height: '16px', width: '50%' }}></div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
          <div className="skeleton" style={{ height: '45px', width: '120px', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '45px', width: '120px', borderRadius: '8px' }}></div>
        </div>
      </div>
    </div>
  );
};

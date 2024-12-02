import PropTypes from 'prop-types';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired
};

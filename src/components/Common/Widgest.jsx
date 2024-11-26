import Trand from "./Trand";

function Widgets({ title, num, trand, Icon, size = '2rem' }) {
  if (isNaN(num) || num === 0) return;
  trand = trand ?? 0;

  const formattedCount = new Intl.NumberFormat('en', { notation: "compact" }).format(num);
  
  return (
    <>
      <div className="grid-item">
      { Icon && <Icon style={{ width: size, height: size }} /> }
        <span className='grid-item-title'>{title}</span>
        <div className="card-footer">
          <h3 className="total-count">{formattedCount}</h3>
          { trand !== 0 && <Trand trand={trand} /> }
        </div>
      </div>
    </>
  )
}

export default Widgets;
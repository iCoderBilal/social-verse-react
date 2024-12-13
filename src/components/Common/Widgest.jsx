import Trand from "./Trand";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function Widgets({ title, num, trand, onClick, Icon, size = '2rem', interactive }) {
  if (isNaN(num) || num === 0) return;
  trand = trand ?? 0;

  const formattedCount = new Intl.NumberFormat('en', { notation: "compact" }).format(num);

  return (
    <>
      <div className="grid-item">
        <div className="card-header">
          <div className="card-header-left">
            {Icon && <Icon style={{ width: size, height: size }} />}
            <span className='grid-item-title'>{title}</span>
          </div>

          {
            interactive &&
            <button onClick={onClick} className="card-header-right">
              <ChevronRightIcon style={{ width: '1.4rem', height: '1.4rem' }} />
            </button>
          }

        </div>
        <div className="card-footer">
          <h3 className="total-count">{formattedCount}</h3>
          {trand !== 0 && <Trand trand={trand} />}
        </div>
      </div>
    </>
  )
}

export default Widgets;
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const navigate = useNavigate();
const MenuButton = (props: Layout.MenuButtonProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { label, href, locale, isItem, items } = props;
  const isActive = pathname === (locale === "en" ? href : `/${locale}${href}`);

  return (
    <div
      className={classNames(
        "relative flex size-full flex-col items-start gap-2",
        {
          "pl-4": isItem,
        }
      )}
    >
      <button
        type="button"
        className={classNames(
          "flex size-full items-center rounded-xl p-0 px-4 py-2 text-center text-base transition-all duration-200 ease-in-out",
          {
            "font-semibold": !isItem,
            "bg-primary-100 font-semibold": isActive,
            "text-textPrimary": !isActive,
            "hover:bg-primary-100 hover:": !isActive && isItem,
            "pointer-events-none cursor-default": !href,
          }
        )}
        onClick={() => href && navigate(href)}
      >
        {label}
      </button>
      {items && (
        <ul className="flex w-full flex-col">
          {items?.map((item) => (
            <li key={item.id} className="flex size-full flex-col items-start">
              <MenuButton
                label={item.label}
                href={item.href}
                locale={locale}
                isItem
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuButton;

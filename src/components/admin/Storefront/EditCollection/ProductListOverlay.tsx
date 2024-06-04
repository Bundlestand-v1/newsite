"use client";

import AlertMessage from "@/components/shared/AlertMessage";
import { useState, useEffect } from "react";
import Spinner from "@/ui/Spinners/Gray";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import {
  ArrowLeftIcon,
  ChangeIndexIcon,
  CloseIcon,
  EditIcon,
  PlusIcon,
} from "@/icons";
import clsx from "clsx";
import Overlay from "@/ui/Overlay";
import { AddProductAction } from "@/actions/collections";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import { capitalizeFirstLetter } from "@/libraries/utils";

export function ProductListButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.productList.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      type="button"
      className="w-9 h-9 rounded-full flex items-center justify-center transition duration-300 ease-in-out active:bg-lightgray lg:hover:bg-lightgray"
    >
      <EditIcon size={20} />
    </button>
  );
}

export function ProductListOverlay({
  data,
}: {
  data: { id: string; products: ProductType[] };
}) {
  const PUBLISHED = "PUBLISHED";
  const DRAFT = "DRAFT";
  const HIDDEN = "HIDDEN";
  const INACTIVE = "INACTIVE";
  const ALL = "ALL";

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [productId, setProductId] = useState("");
  const [filter, setFilter] = useState<string>(ALL);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editCollection.name,
      overlayName: state.pages.editCollection.overlays.productList.name,
      isOverlayVisible:
        state.pages.editCollection.overlays.productList.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible || showAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      if (!isOverlayVisible && !showAlert) {
        document.body.style.overflow = "visible";
      }
    };
  }, [isOverlayVisible, showAlert]);

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const addProduct = async () => {
    if (!productId.trim()) {
      setAlertMessage("Product ID cannot be empty");
      setShowAlert(true);
      return;
    } else if (!/^\d{5}$/.test(productId.trim())) {
      setAlertMessage("Product ID must be a 5-digit number");
      setShowAlert(true);
      return;
    }

    setLoading(true);

    try {
      const message = await AddProductAction({
        collectionId: data.id,
        productId,
      });
      setAlertMessage(message);
      setShowAlert(true);
      setProductId("");
    } catch (error) {
      console.error("Error adding product:", error);
      setAlertMessage("Failed to add product to the collection");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setProductId(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addProduct();
    }
  };

  const filteredProducts = data.products.filter((product) => {
    if (filter === PUBLISHED) {
      return product.visibility.toUpperCase() === PUBLISHED;
    } else if (filter === INACTIVE) {
      return (
        product.visibility.toUpperCase() === HIDDEN ||
        product.visibility.toUpperCase() === DRAFT
      );
    }
    return true;
  });

  return (
    <>
      {isOverlayVisible && (
        <Overlay>
          <div className="md:mx-auto md:mt-20 md:mb-[50vh] md:px-5 lg:p-0">
            <div className="absolute bottom-0 left-0 right-0 w-full h-[calc(100%-60px)] mx-auto overflow-hidden md:overflow-visible rounded-t-3xl bg-white md:w-full md:max-w-max md:rounded-2xl md:shadow md:h-max md:relative md:bottom-auto md:left-auto md:right-auto md:top-auto md:-translate-x-0">
              <div className="w-full">
                <div className="md:hidden flex items-end justify-center pt-4 pb-2 absolute top-0 left-0 right-0 bg-white">
                  <div className="relative flex justify-center items-center w-full h-7">
                    <h2 className="font-semibold text-lg">Products</h2>
                    <button
                      onClick={() => {
                        hideOverlay({ pageName, overlayName });
                      }}
                      type="button"
                      className="w-7 h-7 rounded-full flex items-center justify-center absolute right-4 transition duration-300 ease-in-out bg-lightgray active:bg-lightgray-dimmed"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>
                </div>
                <div className="hidden md:flex md:items-center md:justify-between py-2 pr-4 pl-2">
                  <button
                    onClick={() => {
                      hideOverlay({ pageName, overlayName });
                    }}
                    type="button"
                    className="h-9 px-3 rounded-full flex items-center gap-1 transition duration-300 ease-in-out active:bg-lightgray"
                  >
                    <ArrowLeftIcon
                      className="fill-custom-blue -ml-[2px]"
                      size={20}
                    />
                    <span className="font-semibold text-sm text-custom-blue">
                      Products
                    </span>
                  </button>
                </div>
                <div className="w-full h-full mt-[52px] md:mt-0 px-5 pt-5 pb-28 md:pb-10 flex flex-col gap-2 overflow-x-hidden overflow-y-visible invisible-scrollbar md:overflow-hidden">
                  <div className="w-full flex gap-2 items-center justify-between">
                    <div className="flex rounded-full bg-lightgray *:h-9 *:rounded-full *:flex *:items-center *:justify-center *:font-semibold *:text-sm *:ease-in-out *:duration-300 *:transition">
                      <button
                        onClick={() => setFilter(ALL)}
                        className={`px-3 pl-[14px] h-9 hover:bg-lightgray-dimmed rounded-full ${
                          filter === ALL
                            ? "text-custom-blue"
                            : "text-gray hover:text-black"
                        }`}
                      >
                        View all ({data.products.length})
                      </button>
                      <button
                        onClick={() => setFilter(PUBLISHED)}
                        className={`px-3 h-9 hover:bg-lightgray-dimmed rounded-full ${
                          filter === PUBLISHED
                            ? "text-custom-blue"
                            : "text-gray hover:text-black"
                        }`}
                      >
                        Published (
                        {
                          data.products.filter(
                            (product) =>
                              product.visibility.toUpperCase() === PUBLISHED
                          ).length
                        }
                        )
                      </button>
                      <button
                        onClick={() => setFilter(INACTIVE)}
                        className={`px-3 pr-[14px] h-9 hover:bg-lightgray-dimmed rounded-full ${
                          filter === INACTIVE
                            ? "text-custom-blue"
                            : "text-gray hover:text-black"
                        }`}
                      >
                        Inactive (
                        {
                          data.products.filter(
                            (product) =>
                              product.visibility.toUpperCase() === HIDDEN ||
                              product.visibility.toUpperCase() === DRAFT
                          ).length
                        }
                        )
                      </button>
                    </div>
                    <div className="h-9 rounded-full overflow-hidden flex items-center border shadow-sm">
                      <input
                        type="text"
                        value={productId}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste ID (#12345)"
                        className="h-full w-40 w-44s pl-4 bg-transparent"
                      />
                      <div className="h-full flex items-center justify-center">
                        <button
                          onClick={addProduct}
                          disabled={loading}
                          className={clsx(
                            "w-11 h-9 rounded-full flex items-center justify-center transition duration-300 ease-in-out",
                            {
                              "active:bg-lightgray lg:hover:bg-lightgray":
                                !loading,
                            }
                          )}
                        >
                          {loading ? <Spinner /> : <PlusIcon size={22} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full py-3 border rounded-xl bg-white">
                    <div className="h-full">
                      <div className="h-full overflow-auto custom-x-scrollbar">
                        <table className="w-full text-sm">
                          <thead className="border-y bg-neutral-100">
                            <tr className="h-10 *:font-semibold *:text-gray">
                              <td className="text-center border-r">#</td>
                              <td className="pl-3 border-r">Poster</td>
                              <td className="pl-3 border-r">Name</td>
                              <td className="pl-3 border-r">Price</td>
                              <td className="pl-3 border-r">Visibility</td>
                              <td className="pl-3"></td>
                            </tr>
                          </thead>
                          <tbody className="*:h-[98px] *:border-b">
                            {filteredProducts.map(
                              (
                                { id, poster, name, price, visibility },
                                index
                              ) => (
                                <tr key={id} className="h-[98px]">
                                  <td className="w-14 min-w-14 text-center font-medium border-r">
                                    {index + 1}
                                  </td>
                                  <td className="p-3 w-[120px] min-w-[120px] border-r">
                                    <div className="aspect-square w-full overflow-hidden bg-white">
                                      <Image
                                        src={poster}
                                        alt={name}
                                        width={216}
                                        height={216}
                                        priority
                                      />
                                    </div>
                                  </td>
                                  <td className="px-3 w-[200px] min-w-[200px] border-r">
                                    <p className="line-clamp-3">{name}</p>
                                  </td>
                                  <td className="px-3 w-[100px] min-w-[100px] border-r">
                                    <p>{price}</p>
                                  </td>
                                  <td className="px-3 w-[100px] min-w-[100px] border-r">
                                    {visibility === "PUBLISHED" ? (
                                      <p className="px-3 rounded-full h-6 w-max flex gap-1 items-center bg-custom-green/10 border border-custom-green/15 text-custom-green">
                                        {capitalizeFirstLetter(
                                          visibility.toLowerCase()
                                        )}
                                      </p>
                                    ) : (
                                      <p className="px-3 rounded-full h-6 w-max flex gap-1 items-center bg-lightgray border border-[#6c6c6c]/15 text-gray">
                                        {capitalizeFirstLetter(
                                          visibility.toLowerCase()
                                        )}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-3 w-[200px] min-w-[200px]">
                                    <div className="flex items-center justify-center">
                                      <button className="h-9 w-9 rounded-full flex items-center justify-center ease-in-out duration-300 transition active:bg-lightgray lg:hover:bg-lightgray">
                                        <EditIcon size={20} />
                                      </button>
                                      <button className="h-9 w-9 rounded-full flex items-center justify-center ease-in-out duration-300 transition active:bg-lightgray lg:hover:bg-lightgray">
                                        <ChangeIndexIcon size={18} />
                                      </button>
                                      <button className="h-9 w-9 rounded-full flex items-center justify-center ease-in-out duration-300 transition active:bg-lightgray lg:hover:bg-lightgray">
                                        <IoCloseCircleOutline
                                          className="stroke-grays"
                                          size={24}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Overlay>
      )}
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
        />
      )}
    </>
  );
}
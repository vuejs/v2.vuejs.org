(ns todomvc.item
  (:require [cljs.core.async :refer [>! put!]]
            [todomvc.utils :refer [now hidden]]
            [clojure.string :as string]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(def ESCAPE_KEY 27)
(def ENTER_KEY 13)

;; =============================================================================
;; Todo Item

;; -----------------------------------------------------------------------------
;; Event Handlers

(defn submit [e todo owner comm]
  (when-let [edit-text (om/get-state owner :edit-text)]
    (if-not (string/blank? (.trim edit-text))
      (do
        (om/update! todo assoc :title edit-text)
        (put! comm [:save todo]))
      (put! comm [:destroy todo])))
  false)

(defn edit [e todo owner comm]
  (let [node (om/get-node owner "editField")]
    (put! comm [:edit todo])
    (doto owner
      (om/set-state! :needs-focus true)
      (om/set-state! :edit-text (:title todo)))))

(defn key-down [e todo owner comm]
  (condp == (.-keyCode e)
    ESCAPE_KEY (do
                 (om/set-state! owner :edit-text (:title todo))
                 (put! comm [:cancel todo]))
    ENTER_KEY  (submit e todo owner comm)
    nil))

(defn change [e todo owner]
  (om/set-state! owner :edit-text (.. e -target -value)))

;; -----------------------------------------------------------------------------
;; Todo Item

(defn todo-item [todo owner {:keys [comm]}]
  (reify
    om/IInitState
    (init-state [_]
      {:edit-text (:title todo)})
    om/IDidUpdate
    (did-update [_ _ _ _]
      (when (and (:editing todo)
                 (om/get-state owner :needs-focus))
        (let [node (om/get-node owner "editField")
              len  (.. node -value -length)]
          (.focus node)
          (.setSelectionRange node len len))
        (om/set-state! owner :needs-focus nil)))
    om/IRender
    (render [_]
      (let [class (cond-> ""
                    (:completed todo) (str "completed")
                    (:editing todo)   (str "editing"))]
        (dom/li #js {:className class :style (hidden (:hidden todo))}
          (dom/div #js {:className "view"}
            (dom/input
              #js {:className "toggle" :type "checkbox"
                   :checked (and (:completed todo) "checked")
                   :onChange (fn [_] (om/transact! todo :completed #(not %)))})
            (dom/label
              #js {:onDoubleClick (om/bind edit todo owner comm)}
              (:title todo))
            (dom/button
              #js {:className "destroy"
                   :onClick (fn [_] (put! comm [:destroy todo]))}))
          (dom/input
            #js {:ref "editField" :className "edit"
                 :value (om/get-state owner :edit-text)
                 :onBlur (om/bind submit todo owner comm)
                 :onChange (om/bind change todo owner comm)
                 :onKeyDown (om/bind key-down todo owner comm)}))))))

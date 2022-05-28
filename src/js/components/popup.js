import { WRAPPER } from '../index'

function createPopup(titlePopup, nameBtn) {
    let popup = document.createElement('div')
    popup.className = 'popup'

    let popupWrapper = document.createElement('div')
    popupWrapper.className = 'popup__wrapper'

    let popupTitle = document.createElement('p')
    popupTitle.className = 'popup__title'
    popupTitle.innerText = `${titlePopup}`

    let popupInput = document.createElement('input')
    popupInput.className = 'popup__input'
    popupInput.setAttribute('maxlength', '20')

    let popupBtn = document.createElement('button')
    popupBtn.className = 'popup__button'
    popupBtn.innerText = `${nameBtn}`

    popup.append(popupWrapper)
    popupWrapper.append(popupTitle, popupInput, popupBtn)
    WRAPPER.append(popup)
}

function removePopup(popup) {
    if (popup) popup.remove()
}

export { createPopup, removePopup }

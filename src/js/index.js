import '../index.html'
import '../styles/main.scss'

// popup create folder //
const WRAPPER = document.querySelector('.wrapper')
const BUTTONS = document.querySelector('.header__list')

const clickButton = (e) => {
    const button = e.target
    if (button.dataset.func === 'createFolder') {
        let folder = 'папки'
        createPopup(folder)
    }
}

function createPopup(folder) {
    let popup = document.createElement('div')
    popup.className = 'popup'

    let popupWrapper = document.createElement('div')
    popupWrapper.className = 'popup__wrapper'

    let popupTitle = document.createElement('p')
    popupTitle.className = 'popup__title'
    popupTitle.innerText = `Введите название ${folder}`

    let popupInput = document.createElement('input')
    popupInput.className = 'popup__input'

    let popupBtn = document.createElement('button')
    popupBtn.className = 'popup__button'
    popupBtn.innerText = 'Создать'

    popup.append(popupWrapper)
    popupWrapper.append(popupTitle, popupInput, popupBtn)
    WRAPPER.append(popup)
}

BUTTONS.addEventListener('click', clickButton)

WRAPPER.addEventListener('click', (e) => {
    const target = e.target
    if (
        (!target.closest('.popup__wrapper') &&
            !target.closest('.header__button')) ||
        target.closest('.popup__button')
    ) {
        const popup = document.querySelector('.popup')
        if (popup !== null) {
            popup.remove()
        }
    }
})

import React, { Component } from 'react';
import Header from './components/Header';
import Container from './components/Container';
import ViewSelector from './components/ViewSelector';
import FloatingButton from './components/FloatingButton';
import ContactModal from './components/ContactModal';
import Dimmed from './components/Dimmed';
import ContactList from './components/ContactList';
import Input from './components/Input';
import FavoriteList from './components/FavoriteList';

import oc from 'open-color';

import shortid from 'shortid';

function generateRandomColor() {
    const colors = [
        'gray',
        'red',
        'pink',
        'grape',
        'violet',
        'indigo',
        'blue',
        'cyan',
        'teal',
        'green',
        'lime',
        'yellow',
        'orange'
    ];

    const random = Math.floor(Math.random() * 13);

    return oc[colors[random]][6];
}

class App extends Component {

    state = {
        view: 'favorite',
        modal: {
            visible: false,
            mode: null // create or modify
        },
        contacts: [
            {
                "id": "SyKw5cyAl",
                "name": "Ronaldo",
                "phone": "010-0000-0000",
                "color": "#40c057",
                "favorite": true
            },
            {
                "id": "r1s_9c10l",
                "name": "Beckam",
                "phone": "010-0000-0001",
                "color": "#12b886",
                "favorite": true
            },
            {
                "id": "BJcFqc10l",
                "name": "Figo",
                "phone": "010-0000-0002",
                "color": "#fd7e14",
                "favorite": false
            },
            {
                "id": "BJUcqqk0l",
                "name": "Zidane",
                "phone": "010-0000-0003",
                "color": "#15aabf",
                "favorite": false
            },
            {
                "id": "rJHoq91Cl",
                "name": "Raul",
                "phone": "010-0000-0004",
                "color": "#e64980",
                "favorite": false
            }
        ],
        search: ''
    }    

    componentDidMount() {
        const contacts = localStorage.getItem('contacts');

        // 
        if(contacts) {
            this.setState({
                contacts: JSON.parse(contacts)
            });
        }

    }

    componentDidUpdate(prevProps, prevState) {
        // 
        if(prevState.contacts !== this.state.contacts) {
            localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
        }
    }
    
    // 
    handleSelectView = (view) => this.setState({view})

    
    modalHandler = {
        show: (mode, payload) => {
            this.setState({
                modal: {
                    mode,
                    visible: true,
                    ...payload 
                }
            })
        },
        hide: () => {
            this.setState({
                modal: {
                    ...this.state.modal, 
                    visible: false
                }
            })
        },
        change: ({name, value}) => {
            this.setState({
                modal: {
                    ...this.state.modal, 
                    [name]: value 
                }
            })
        },
        action: {
            create: () => {
               
                const id = shortid.generate();

                
                const { contacts, modal: { name, phone, color } } = this.state;

                
                const contact = {
                    id,
                    name,
                    phone,
                    color,
                    favorite: false 
                };

                this.setState({
                 
                    contacts: [...contacts, contact]
                });

           
                this.modalHandler.hide();
            },
            modify: () => {
            
                const {
                    modal: { name, phone, index },
                    contacts
                } = this.state;

                const item = contacts[index];

               
                this.setState({
                    contacts: [
                        ...contacts.slice(0, index), 
                        {
                            ...item, 
                            name, 
                            phone 
                        },
                        ...contacts.slice(index + 1, contacts.length)
                    ]
                });

        
                this.modalHandler.hide();
            },
            remove: () => {
                
                const {
                    modal: { index },
                    contacts
                } = this.state;

               
                this.setState({
                    contacts: [
                        ...contacts.slice(0, index), 
                        ...contacts.slice(index + 1, contacts.length) 
                    ]
                });

             
                this.modalHandler.hide();
            }
        }
    }

 
    handleFloatingButtonClick = () => {

        const { view } = this.state;
        if(view !== 'list') 
            this.setState({view: 'list'});
        
 
        this.modalHandler.show(
            'create',
            {
                name: '',
                phone: '',
                color: generateRandomColor()
            }
        );
    }

    itemHandler = {
        toggleFavorite: (id) => {
            const { contacts } = this.state;
         
            const index = contacts.findIndex(contact => contact.id === id);
            const item = contacts[index];

            this.setState({
                contacts: [
                    ...contacts.slice(0, index),
                    {
                        ...item,
                        favorite: !item.favorite 
                    },
                    ...contacts.slice(index + 1, contacts.length)
                ]
            });

        },
        openModify: (id) => {
            const { contacts } = this.state;
          
            const index = contacts.findIndex(contact => contact.id === id);
            const item = this.state.contacts[index];
            
            this.modalHandler.show(
                'modify',
                {
                    ...item,
                    index
                }
            );
        }
    }



    handleSearchChange = (e) => {
        this.setState({
            search: e.target.value
        });
    }

    render() {
        
        const { 
            handleSelectView,
            handleFloatingButtonClick,
            modalHandler,
            itemHandler,
            handleSearchChange
        } = this;

        const { 
            view,
            modal,
            contacts,
            search
        } = this.state;

        return (
            <div>
                <Header/>
                <ViewSelector onSelect={handleSelectView} selected={view}/>
       
                <Container visible={view==='favorite'}>
                    <FavoriteList contacts={contacts}/>
                </Container>
                <Container visible={view==='list'}>
                    <Input onChange={handleSearchChange} value={search} placeholder="검색"/>
                    <ContactList 
                        contacts={contacts}
                        onOpenModify={itemHandler.openModify}
                        onToggleFavorite={itemHandler.toggleFavorite}
                        search={search}
                    />
                </Container>
                
                <ContactModal 
                    {...modal} 
                    onHide={modalHandler.hide}
                    onChange={modalHandler.change}
                    onAction={modalHandler.action[modal.mode]}
                    onRemove={modalHandler.action.remove}
                />
                <Dimmed visible={modal.visible}/>
                <FloatingButton onClick={handleFloatingButtonClick}/>
            </div>
        );
    }
}

export default App;
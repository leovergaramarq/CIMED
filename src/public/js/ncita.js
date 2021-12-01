(() => {
    // Calendar
    let calendar = null;
    document.addEventListener('DOMContentLoaded', function() {
        const calendarEl = document.getElementById('calendar');
    
        calendar = new FullCalendar.Calendar(calendarEl, {
            eventClick: function(info) {
                console.log(info);
            },
            headerToolbar: {
                center: 'addEventButton'
            },
            customButtons: {
                addEventButton: {
                    text: 'Agendar cita',
                    click: () => openModal(),
                }
            },
            initialView: 'dayGridMonth',
            initialDate: '2021-12-01',
            // headerToolbar: {
                // left: 'prev,next today',
                // center: 'title',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay'
            // },
            events: [
                {
                    title: 'All Day Event',
                    start: '2021-12-01'
                },
                {
                    title: 'Long Event',
                    start: '2021-12-07',
                    end: '2021-12-10'
                },
                {
                    groupId: '999',
                    title: 'Repeating Event',
                    start: '2021-12-09T16:00:00'
                },
                {
                    groupId: '999',
                    title: 'Repeating Event',
                    start: '2021-12-16T16:00:00'
                },
                {
                    title: 'Conference',
                    start: '2021-12-11',
                    end: '2021-12-13'
                },
                {
                    title: 'Meeting',
                    start: '2021-12-12T10:30:00',
                    end: '2021-12-12T12:30:00'
                },
                {
                    title: 'Lunch',
                    start: '2021-12-12T12:00:00'
                },
                {
                    title: 'Meeting',
                    start: '2021-12-12T14:30:00'
                },
                {
                    title: 'Birthday Party',
                    start: '2021-12-13T07:00:00'
                },
                {
                    title: 'Click for Google',
                    url: 'http://google.com/',
                    start: '2021-12-28'
                }
            ],
        });
    
        calendar.render();
    });

    const $modal = document.querySelector('.modal');
    const $mask = document.querySelector('#mask');
    const $events = [...$modal.querySelectorAll('.modal-events__item')];

    function closeModal() {
        $modal.classList.add('hidden');
        $mask.classList.add('hidden');
    }

    function openModal() {
        $modal.classList.remove('hidden');
        $mask.classList.remove('hidden');
    }

    document.addEventListener('keyup', e => {
        window.location.pathname === '/ncita' && e.key === 'Escape' 
            && ![...$modal.classList].includes('hidden') && closeModal();
    });

    $modal.querySelector('.modal__dismiss').addEventListener('click', () => closeModal());

    $modal.querySelector('.modal__confirm').addEventListener('click', () => {
        closeModal();

        let $event = $events.find(e => [...e.classList].includes('sel'));
        let doc = $event.querySelector('.modal-body__item__doc').textContent;
        let esp = $event.querySelector('.modal-body__item__esp').textContent;
        let date = $event.querySelector('.modal-body__item__date').textContent;
        let start = $event.querySelector('.modal-body__item__start').textContent;
        let end = $event.querySelector('.modal-body__item__end').textContent;
        let place = $event.querySelector('.modal-body__item__place').textContent;

        // console.log(doc, esp, date, start, end, place);
        const hourToMilis = hour => {
            let [hours, mins, rest] = hour.split(':');
            hours = +hours;
            mins = +mins;
            if(rest.includes('p. m.')) hours = (hours + 12) % 24;
            return ((hours - 5) * 3600 + mins * 60) * 1000;
        }
        date = new Date(date.split('/').reverse().join('/')).getTime();
        start = new Date(date + hourToMilis(start)).toISOString();
        end = new Date(date + hourToMilis(end)).toISOString();
        date = new Date(date).toISOString();

        console.log(calendar);

        calendar.addEvent({
            title: esp,
            start, end,
            allDay: false,
        });
    });
    
    $events.forEach($event => {
        $event.addEventListener('click', () => {
            $event.classList.toggle('sel');
            if([...$event.classList].includes('sel')) {
                $events.forEach($event2 => {
                    if($event !== $event2) {
                        if([...$event2.classList].includes('sel')) {
                            $event2.classList.remove('sel');
                        }
                    }
                })
            }
        });
    })

    // Autocomplete
    autocomplete(document.getElementById("input-doc"), ['juanito perez', 'senior maya', 'juanito alcachofa']);

    // Submit form
    const $form = document.querySelector('.modal-form form');
    
    $form.addEventListener('submit', e => {
        closeModal();
        // e.preventDefault();
    })
})();

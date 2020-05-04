import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Button, Dropdown, Checkbox, Accordion, Form, Menu, Segment } from 'semantic-ui-react';
import FormItemWrapper from '../../Form/FormItemWrapper.jsx';


const sortbyoptions = [
    {
        key: 'Newest first',
        text: 'Newest first',
        value: 'Newest first',
        content: 'Newest first',
        
    },
    {
        key: 'Oldest first',
        text: 'Oldest first',
        value: 'Oldest first',
        content: 'Oldest first',
    },
]

const options = [
    { key: 'ShowActive', text: 'ShowActive', value: 'ShowActive' },
    { key: 'ShowClosed', text: 'ShowClosed', value: 'ShowClosed' },
    { key: 'ShowDraft', text: 'ShowDraft', value: 'ShowDraft' },
    { key: 'ShowExpired', text: 'ShowExpired', value: 'ShowExpired' },
    { key: 'ShowUnexpired', text: 'ShowUnexpired', value: 'ShowUnexpired' },
    ]

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            itemsPerPage: 2,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: 0
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.setPageNum = this.setPageNum.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnfilter = this.handleOnfilter.bind(this);
        
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
      
        this.loadData(this.state.activePage, this.state.sortBy.date, this.state.filter.showActive,
            this.state.filter.showClosed, this.state.filter.showDraft, this.state.filter.showExpired,
            this.state.filter.showUnexpired);
        
    };

    loadData(activepage, sortbydate, showactive, showclosed, showdraft, showexpired, showunexpired) {

        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs'
        var data =
        {
            activePage: activepage,
            sortbyDate: sortbydate,
            showActive: showactive,
            showClosed: showclosed,
            showDraft: showdraft,
            showExpired: showexpired,
            showUnexpired: showunexpired,

        }
        console.log("Manage Job Link", link);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            data:data,
            dataType: "json",
            success: function (res) {
                console.log("loadJobs data", res);
                let loadJobs = null
                if (res.myJobs) {
                    loadJobs = res.myJobs
                    console.log("myJobs data", loadJobs);
                    this.setState({
                        loadJobs: res.myJobs
                    })
                } 
               
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
        this.init()
       // your ajax call and other logic goes here
    }

    


    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    setPageNum(event, { activePage }) {
        this.setState({ activePage: activePage });
    };

     handleOnChange(e, data) {
         console.log(data.value);
         if (data.value === 'Newest first') {
             
             this.loadData(this.state.activePage, "desc", this.state.filter.showActive,
                 this.state.filter.showClosed, this.state.filter.showDraft, this.state.filter.showExpired,
                 this.state.filter.showUnexpired);
         } else {
             this.loadData(this.state.activePage, "", this.state.filter.showActive,
                 this.state.filter.showClosed, this.state.filter.showDraft, this.state.filter.showExpired,
                 this.state.filter.showUnexpired);
         }
  
    }
    handleOnfilter(e, data) {
        console.log(data.value);
        if (data.value === 'ShowActive') { 
            this.loadData(this.state.activePage, "desc", false,
                true, this.state.filter.showDraft, this.state.filter.showExpired,
                this.state.filter.showUnexpired);
        } else if (data.value === 'ShowClosed') {
            this.loadData(this.state.activePage, "desc", this.state.filter.showActive,
                this.state.filter.showClosed, this.state.filter.showDraft, this.state.filter.showExpired,
                this.state.filter.showUnexpired);
        } else if (data.value === 'ShowDraft') {
            this.loadData(this.state.activePage, "desc", this.state.filter.showActive,
                true, false, this.state.filter.showExpired,
                this.state.filter.showUnexpired);
        } else if (data.value === 'ShowExpired') {
            this.loadData(this.state.activePage, "desc", this.state.filter.showActive,
                true, this.state.filter.showDraft, false, 
                this.state.filter.showUnexpired);
        } else if (data.value === 'ShowUnexpired') {
            this.loadData(this.state.activePage, "desc", this.state.filter.showActive,
                true, this.state.filter.showDraft, this.state.filter.showExpired,
                false);
        }

    }

    

    

    render() {
        

        const itemsPerPage = 2;
        const { activePage } = this.state;
        const totalPages = this.state.loadJobs.length / itemsPerPage;
        const items = this.state.loadJobs.slice(
            (activePage - 1) * itemsPerPage,
            (activePage - 1) * itemsPerPage + itemsPerPage
        );
        console.log(items);

        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                    <h1>List of Jobs </h1>

                    <div class="ui text menu">
                                    <div class="item">
                                        
                                        <i aria-hidden="true" class="filter icon" style={{ color: 'black' }} ></i>
                                        Filter:

                                        
                                         <Dropdown style={{ color: 'black' }}
                                            placeholder=' Choose filter'
                                            options={options}
                                            defaultValue={options[1].value}
                                            onChange={this.handleOnfilter}
                                        />
                                            
                                                    
                        </div>
                        <div class="item">
                                        <i aria-hidden="true" class="calendar alternate outline icon" style={{ color: 'black' }} ></i>
                            Sort by date:
                       
                                        <Dropdown style={{ color: 'black' }}
                                            placeholder=' Newest first'
                                            options={sortbyoptions}
                                            defaultValue={sortbyoptions[0].value}
                                            onChange={this.handleOnChange}
                                        />
                        </div>

                    </div>

                                <div className="ui container">
                                    {this.state.loadJobs.length > 0 ? this.renderJoblist(items) : this.renderNoJob()}
                    </div>
                                
                                <div class="ui center aligned container" style={{ marginTop: '30px' }}>
                                    <Pagination 
                                        activePage={activePage}
                                        totalPages={totalPages}
                                        siblingRange={1}
                                        onPageChange={this.setPageNum}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </BodyWrapper>
        )
    }

    renderNoJob() {
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p> No Jobs Found</p>
                    </React.Fragment>
                </div>
            </div>
        )
    }

    renderJoblist(items) {
       

        return (
            <div className="ui container">
            <div class="ui two column grid">
                <div class="row">
                    {items.map(data => {

                    return (
                       
                            <div class="column">
         
                        <div class="ui card segment" style={{ width: 75 + "%" }}>

                            <div class="content">
                                <h4 class="ui header">{data.title}</h4>
                                <a class="ui black right ribbon label"><i class="user icon"></i>{data.status}</a>

                                <div class="meta">{data.location.city}, {data.location.country}</div>
                                    <div class="description">{data.summary}</div>

                            </div>

                                <div class="extra content" style={{ marginTop:'70px'}}>
                                <span class="left floated">
                                    <div class="ui mini buttons">
                                        <button class="ui red button">Expired</button>
                                    </div>
                                </span>
                                <span class="right floated">
                                    <div class="ui mini buttons">
                                        <button class="ui blue basic button" tabindex="0">
                                            <i aria-hidden="true" class="ban icon"></i>
                                            Close
                                </button>
                                        <button class="ui blue basic button" tabindex="0">
                                            <i aria-hidden="true" class="edit icon"></i>
                                            Edit
                                </button>
                                        <button class="ui blue basic button" tabindex="0">
                                            <i aria-hidden="true" class="copy outline icon"></i>
                                            Copy
                                </button>

                                    </div>
                                </span>
                                </div>

                                

                        </div>
                    </div>     

                    )

                })}
                    
                </div>
               
            </div>


                
                </div>
        )
    }
}
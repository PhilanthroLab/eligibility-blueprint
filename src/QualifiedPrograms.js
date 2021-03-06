import React, {Component} from 'react';
import {
    Row,
    Col,
    Card,
    CardBlock,
    CardFooter,
    CardTitle,
    CardText,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';

import {
    connect
} from 'react-redux';

import {
    push
} from 'react-router-redux';

import {
    calculateProgramsEligibility,
    startOverForEligibility
} from './actions/eligibilityActions';
import translation from './translation';

export class QualifiedPrograms extends Component{

    constructor(props) {
        super(props);
        this.startOver = this.startOver.bind(this);
    }

    componentWillMount() {
        const {dispatch, answers} = this.props;
        dispatch(calculateProgramsEligibility(answers));
    }

    startOver() {
        const { dispatch } = this.props;
        dispatch(startOverForEligibility());
        dispatch(push('/'));
    }


    renderAnswers() {
        const { questions, answers} = this.props;
        if(Object.keys(answers).length === 0) {
            return (
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <CardBlock className="text-center">
                                <CardTitle>{translation.t('SUBMITTED_ANSWERS')}</CardTitle>
                                <CardText>{translation.t('NO_ANSWERS_SUBMITTED')}</CardText>
                            </CardBlock>
                        </Card>
                    </Col>
                </Row>
            )
        }

        return (
            <Row className="mt-3">
                <Col>
                    <Card>
                        <CardBlock className="text-center">
                            <CardTitle>{translation.t('SUBMITTED_ANSWERS')}</CardTitle>
                            <CardText>
                                {
                                    Object.keys(answers).map((answer) => {
                                        const question = questions.find(question => question.id === parseInt(answer, 10));
                                        return(
                                                <div key={question.id}>
                                                    <h5>{translation.t(question.question)}</h5>
                                                    <p>{translation.t(answers[answer].toString().toUpperCase())}</p>
                                                </div>
                                        );
                                    })
                                }
                            </CardText>
                        </CardBlock>
                        <CardFooter>
                          <Button outline color="primary" onClick={this.startOver} className="float-right">{translation.t('START_OVER')}</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        )
    }

    render(){
        if(!this.props.calculated) {
            return (
                <Row>
                    <Col>
                        <Row className="mt-3">   
                            <Col md={{ size: 8, push: 1, pull: 1, offset: 1 }} sm="12" className="text-center">
                                <Card>
                                    <CardBlock>
                                        <CardText>{translation.t('CALCULATING_ELIGIBILITY')}</CardText>
                                    </CardBlock>
                                </Card>
                            </Col>
                        </Row>
                        {this.renderAnswers()}
                    </Col>
                </Row>
            );
        }

        if(this.props.programs.length === 0) {
            return (
                <Row>
                    <Col>
                        <Row className="mt-3">   
                            <Col md={{ size: 8, push: 1, pull: 1, offset: 1 }} sm="12" className="text-center">
                                <Card>
                                    <CardBlock>
                                        <CardTitle>Sorry, the family/individual is not eligible for any programs at this time</CardTitle>
                                        <CardText>As the situtation changes, please make sure to consult this tool again.</CardText>
                                    </CardBlock>
                                </Card>
                            </Col>
                        </Row>
                        {this.renderAnswers()}
                    </Col>
                </Row>
            )
        }

        const uniquePrograms = [...new Set(this.props.programs)];
        return (
            <Row>
            <Col>
                <Row>
                    <Col sm={{ size: 8, push: 1, pull: 1, offset: 1 }}>
                        <h5>{translation.t('QUALIFIED_PROGRAMS_FOR_CASE')}</h5>
                        <ListGroup>
                        {
                            uniquePrograms.map((program) => {
                                return (<ListGroupItem key={program.id}>{translation.t(program.program)}</ListGroupItem>);
                            })
                        }
                        </ListGroup>
                    </Col>
                </Row>
                {this.renderAnswers()}
                </Col>
                </Row>
        )
    }
}

function mapStateToProps(state) {
    return {
        answers: state.answers.responses,
        questions: state.data.questions,
        programs: state.eligiblePrograms,
        calculated: state.answers.calculated
    }
}

export default connect(mapStateToProps)(QualifiedPrograms);
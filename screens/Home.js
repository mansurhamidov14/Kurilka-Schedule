/**
 * Created by user on 04.04.2019.
 */
import React from 'react';
import {
    TimePickerAndroid,
    ScrollView, View,
    Text, TouchableWithoutFeedback,
    Button, Platform
} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {Permissions, Notifications} from 'expo';
import moment from 'moment';
import {connect} from 'react-redux';
import {addSmokingTime, deleteSmokingTime} from '../actions';

const initialState = {
    timeValue: null,
    hours: 0,
    minutes: 0
};

class HomeScreen extends React.Component {
    state = initialState;
    showPicker = async () => {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: parseFloat(this.state.hours),
                minute: parseFloat(this.state.minutes),
                is24Hour: true, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                newState = {
                    timeValue: `${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}`,
                    hours: ('0' + hour).slice(-2),
                    minutes: ('0' + minute).slice(-2)
                };
                this.setState(newState);
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    };

    async saveSmokingTime() {

        const LocalNotification = {
            title: 'Siqaret vaxtıdı Mans',
            body: 'Çıxart birini yandır',
            vibrate: true,
            android: {
                channelId: 'smoking-time'
            }

        };
        const currentDate = moment().format('YYYYMMDD');
        const scheduleDateTime = moment(`${currentDate}${this.state.hours}${this.state.minutes}00`, 'YYYYMMDDhhmmss').unix();
        const schedulingOptions = {
            time: scheduleDateTime * 1000,
            repeat: 'day'
        };
        let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);

        if(result.permissions.notifications.status === 'granted') {
            Notifications.scheduleLocalNotificationAsync(
                LocalNotification, schedulingOptions
            ).then(notificationId => {
                this.props.addSmokingTime({id: notificationId, ...LocalNotification, smokingTime: this.state.timeValue});
                this.setState(initialState)
            });
        }
    }

    deleteSmokingTime (id) {
        Notifications.cancelScheduledNotificationAsync(id);
        this.props.deleteSmokingTime(id);
    }

    componentDidMount () {
        if (Platform.OS === 'android') {
            Expo.Notifications.createChannelAndroidAsync('smoking-time', {
                name: 'Siqaret vaxtıdı Mans',
                sound: true,
                vibrate: [0, 700, 200, 700],
            });
        }
    }

    render () {
        let scheduleList = this.props.schedule.sort((a, b) => a.smokingTime.localeCompare(b.smokingTime));
        return (
            <View style={{flex: 1, backgroundColor: '#EAEAEA', justifyContent: 'flex-start', paddingTop: 25, paddingLeft: 15, paddingRight: 15}}>
                <ScrollView>
                    <View style={{marginVertical: 10}}>
                        {scheduleList.map(time => {
                            return <ListItem
                                key={time.id} title={time.smokingTime}
                                rightIcon={<TouchableWithoutFeedback
                                    onPress={() => this.deleteSmokingTime(time.id)}><Icon type="font-awesome" name="trash" color="#c00"/>
                                </TouchableWithoutFeedback>}
                                containerStyle={{borderBottomWidth: 0.5, borderColor: '#EAEAEA', height: 45}}
                            />
                        })}
                    </View>
                    <View style={{marginTop: 20}}>
                        <TouchableWithoutFeedback onPress={() => this.showPicker()}>
                            <View style={{backgroundColor: '#eaeaea'}}>
                                <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingVertical: 3, backgroundColor: '#ccc'}}>
                                    <Text style={{textAlign: 'center', color: '#000', fontSize: 13}}>Yenisini əlavə et</Text>
                                </View>
                                <View style={{paddingVertical: 7, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#FFF'}}>
                                    <Text style={{textAlign: 'center', fontSize: 16, color: '#555'}}>{this.state.timeValue || 'Vaxt seçilməyib'}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop: 15}}>
                       <Button title="Əlavə et" color="#3693B4" disabled={!this.state.timeValue} onPress={() => this.saveSmokingTime()}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        schedule: state.schedule
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addSmokingTime: (payload) => dispatch(addSmokingTime(payload)),
        deleteSmokingTime: id => dispatch(deleteSmokingTime(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
import React, { Component, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Animated, { EasingNode } from 'react-native-reanimated';

export default class List extends Component {

    static defaultProps = {
        data: [],
        selectedArray: [],
        setSelectedArray: () => { },
        scrollEnabled: true,
        singleChoice: false,
        showsVerticalScrollIndicator: false,
        maxSelection: null,
        keyExtractor: (item, index) => { return index },
        renderItem: () => { },
        renderSelectedItem: () => { },
        onItemPressed: () => { },
        itemSeparatorComponent: () => { },
        listHeaderComponent: () => { },
        listEmptyComponent: () => { }
    }

    static propTypes = {
        renderItem: PropTypes.any,
        renderSelectedItem: PropTypes.any,
        scrollEnabled: PropTypes.bool,
        data: PropTypes.any,
        singleChoice: PropTypes.bool,
        onItemPressed: PropTypes.any,
        selectedArray: PropTypes.array,
        setSelectedArray: PropTypes.any,
        itemSeparatorComponent: PropTypes.any,
        keyExtractor: PropTypes.any,
        showsVerticalScrollIndicator: PropTypes.bool,
        maxSelection: PropTypes.number,
        listHeaderComponent: PropTypes.any,
        listEmptyComponent: PropTypes.any
    }

    constructor(props) {
        super(props);
    }

    handleChange(a) {
        this.props.setSelectedArray([...a])
        this.forceUpdate()
    }

    itemPressed(key, item) {
        const selectedArray = this.props.selectedArray
        const maxSelection = this.props.maxSelection
        const onItemPressed = this.props.onItemPressed
        let newArr = selectedArray
        if (this.props.singleChoice) {
            this.handleChange([key])
            return
        }
        if (!newArr.includes(key)) {
            if (maxSelection != null) {
                if (selectedArray.length < maxSelection) {
                    onItemPressed({ ...item, selected: true })
                    newArr.push(key)
                }
            } else {
                onItemPressed({ ...item, selected: true })
                newArr.push(key)
            }
        } else {
            if (selectedArray.length != 0) {
                onItemPressed({ ...item, selected: false })
                newArr = selectedArray.filter(element => element != key)
            } else {
                onItemPressed({ ...item, selected: false })
                this.handleChange([key])
            }
        }
        this.handleChange(newArr)
    }

    render() {
        return (
            <>
                <View>
                    {this.props.listHeaderComponent()}
                </View>
                <FlatList
                    data={this.props.data}
                    keyExtractor={this.props.keyExtractor}
                    scrollEnabled={this.props.scrollEnabled}
                    ListEmptyComponent={this.props.listEmptyComponent()}
                    showsVerticalScrollIndicator={this.props.showsVerticalScrollIndicator}
                    renderItem={(item) => {
                        let key = item.item.key ? item.item.key : item.index
                        let selected = this.props.selectedArray.includes(key)
                        let disabled = item.item.disabled ? item.item.disabled : false
                        return (
                            <Pressable disabled={disabled} onPress={() => {
                                this.itemPressed(key, item.item)
                            }}>
                                {selected ? this.props.renderSelectedItem(item) : this.props.renderItem(item)}
                                {this.props.itemSeparatorComponent({ ...item, selected: selected })}
                            </Pressable>
                        )
                    }}
                />
            </>
        )
    }
}
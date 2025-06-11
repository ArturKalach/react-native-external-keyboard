//
//  RNAOSortedMap.m
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNAOSortedMap.h"

@implementation RNAOSortedMap {
    NSMutableDictionary *_dirctionary;
    NSMutableArray *_sortedKeys;
    NSMutableArray *_cachedResult;
    BOOL _hasBeenChanged;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _dirctionary = [NSMutableDictionary dictionary];
        _sortedKeys = [NSMutableArray array];
        _cachedResult = [NSMutableArray array];
        _hasBeenChanged = YES;
    }
    return self;
}

- (void)updateSortedKey:(NSNumber*)position {
    if([_sortedKeys count] == 0) {
        [_sortedKeys addObject: position];
    } else {
        NSInteger indexOfFirstLarger = -1;
        
        for (NSInteger i = 0; i < _sortedKeys.count; i++) {
            NSNumber *number = _sortedKeys[i];
            if ([number integerValue] > [position integerValue]) {
                indexOfFirstLarger = i;
                break;
            }
        }
        
        
        if(indexOfFirstLarger == -1) {
            [_sortedKeys addObject: position];
        } else {
            [_sortedKeys insertObject:position atIndex:indexOfFirstLarger];
        }
    }
}

- (void)put:(NSNumber*)position withObject:(NSObject*)obj {
    _hasBeenChanged = YES;
    if([_dirctionary objectForKey:position] == nil) {
        [self updateSortedKey: position];
    }
    [_dirctionary setObject: obj forKey:position];
}

- (void)remove:(NSNumber*)position {
    _hasBeenChanged = YES;
    NSUInteger positionIndex = [_sortedKeys indexOfObject:position];
    if (positionIndex != NSNotFound) {
        [_sortedKeys removeObjectAtIndex:positionIndex];
    }
    [_dirctionary removeObjectForKey:position];
}


- (void)remove:(NSNumber*)position withObject:(NSObject*)obj {
    if([_dirctionary objectForKey:position] == obj) {
        NSUInteger positionIndex = [_sortedKeys indexOfObject:position];
        if (positionIndex != NSNotFound) {
            [_sortedKeys removeObjectAtIndex:positionIndex];
        }
        [_dirctionary removeObjectForKey:position];
    }
}

- (void)clear {
    [_dirctionary removeAllObjects];
    [_sortedKeys removeAllObjects];
    [_cachedResult removeAllObjects];
}

- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj {
    _hasBeenChanged = YES;
    [self remove:lastPosition withObject: obj];
    [self put:position withObject:obj];
}

- (NSArray*)getValues {
    if(_hasBeenChanged) {
        [_cachedResult removeAllObjects];
        for (NSNumber *itemPosition in _sortedKeys) {
            NSObject *item = [_dirctionary objectForKey:itemPosition];
            if(item != nil) {
                [_cachedResult addObject:item];
            }
        }
        return _cachedResult;
    } else {
        return _cachedResult;
    }
}

@end

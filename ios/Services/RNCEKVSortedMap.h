//
//  RNCEKVSortedMap.h
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#ifndef RNCEKVSortedMap_h
#define RNCEKVSortedMap_h

@interface RNCEKVSortedMap : NSObject

- (void)put:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)position withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (NSArray*)getValues;
- (BOOL)isEmpty;
@end

#endif /* RNCEKVSortedMap_h */

//
//  RNCEKVPropHelper.h
//  Pods
//
//  Created by Artur Kalach on 14/06/2025.
//

#ifndef RNCEKVPropHelper_h
#define RNCEKVPropHelper_h

#include <string>

@interface RNCEKVPropHelper : NSObject

+ (BOOL)isPropChanged:(NSString *)prop stringValue:(std::string)stringValue;
+ (BOOL)isPropChanged:(NSNumber *)prop intValue:(int)intValue;
+ (NSString*)unwrapStringValue:(std::string)stringValue;
+ (NSNumber*)unwrapIntValue:(int)intValue;

@end

#endif /* RNCEKVPropHelper_h */
